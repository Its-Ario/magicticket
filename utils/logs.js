module.exports = {
  async log(logsType, logs, client) {
    if (!client.config.logs) return;
    if (!client.config.logsChannelId) return;
    const channel = await client.channels.fetch(client.config.logsChannelId).catch(e => console.error("The channel to log events is not found!\n", e));
    if (!channel) return console.error("The channel to log events is not found!");

    let webhooks = await channel.fetchWebhooks()
    if (webhooks.size === 0) {
      await channel.createWebhook({ name: "MagicTicket Logs"});
      webhooks = await channel.fetchWebhooks();
    }
    const webhook = webhooks.first();

    if (logsType === "ticketCreate") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("3ba55c")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) تیکت (<#${logs.ticketChannelId}>) رو با دلیل \`${logs.reason}\` ساخت.`);

      webhook.send({
        username: "Ticket Created",
        avatarURL: "https://i.imgur.com/M38ZmjM.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };

    if (logsType === "ticketClaim") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("faa61a")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) تیکت ${logs.ticketId} (<#${logs.ticketChannelId}>) رو بعد از ${client.msToHm(new Date(Date.now() - logs.ticketCreatedAt))} از ساخت کلیم کرد!`);

      webhook.send({
        username: "Ticket Claimed",
        avatarURL: "https://i.imgur.com/qqEaUyR.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };

    if (logsType === "ticketClose") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("ed4245")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) تیکت$ {logs.ticketId} (<#${logs.ticketChannelId}>) رو با دلیل: \`${logs.reason}\` بعد از ${client.msToHm(new Date(Date.now() - logs.ticketCreatedAt))} از ساخت بست.`);

      webhook.send({
        username: "Ticket Closed",
        avatarURL: "https://i.imgur.com/5ShDA4g.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };

    if (logsType === "ticketDelete") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("ed4245")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) تیکت ${logs.ticketId} رو بعد از ${client.msToHm(new Date(Date.now() - logs.ticketCreatedAt))} از ساخت پاک کرد!\n\nTranscript: ${logs.transcriptURL}`);

      webhook.send({
        username: "Ticket Deleted",
        avatarURL: "https://i.imgur.com/obTW2BS.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };

    if (logsType === "userAdded") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("3ba55c")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) Added <@${logs.added.id}> (${logs.added.id}) to the ticket n°${logs.ticketId} (<#${logs.ticketChannelId}>)`);

      webhook.send({
        username: "User Added",
        avatarURL: "https://i.imgur.com/G6QPFBV.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };

    if (logsType === "userRemoved") {
      const embed = new client.discord.EmbedBuilder()
      .setColor("ed4245")
      .setAuthor({ name: logs.user.tag, iconURL: logs.user.avatarURL })
      .setDescription(`${logs.user.tag} (<@${logs.user.id}>) Removed <@${logs.removed.id}> (${logs.removed.id}) from the ticket n°${logs.ticketId} (<#${logs.ticketChannelId}>)`);

      webhook.send({
        username: "User Removed",
        avatarURL: "https://i.imgur.com/eFJ8xxC.png",
        embeds: [embed]
      }).catch(e => console.log(e));
    };
  }
};